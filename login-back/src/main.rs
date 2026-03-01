mod auth;
mod handlers;
mod models;
mod repositories;

use axum::{
    routing::{get, post},
    Router,
};
use std::net::SocketAddr;
use std::{env, sync::Arc};
use http::header::{AUTHORIZATION, CONTENT_TYPE};
use sqlx::PgPool;
use tower_http::cors::{Any, CorsLayer};
use dotenvy::dotenv;
use tokio::net::TcpListener;
use crate::handlers::user::{all_user, create_user, find_user};
use crate::repositories::user::{UserRepository, UserRepositoryForDb};

#[tokio::main]
async fn main() {
    let log_level = env::var("RUST_LOG").unwrap_or("info".to_string());
    unsafe {
        env::set_var("RUST_LOG", log_level)
    };
    tracing_subscriber::fmt::init();
    dotenv().ok();

    let database_url = &env::var("DATABASE_URL").expect("undefined [DATABASE_URL]");
    tracing::debug!("start_connect database...");
    let pool = PgPool::connect(database_url)
        .await
        .expect(&format!("fail connect database, url is [{}]", database_url));

    let app = create_app(UserRepositoryForDb::new(pool.clone()));
    let addr = SocketAddr::from(([127, 0, 0, 1], 4000));
    let listener = TcpListener::bind(addr).await.unwrap();

    axum::serve(listener, app).await.unwrap();
}

fn create_app<T: UserRepository + Send + Sync>(user_repository: T) -> Router {
    let state = Arc::new(user_repository);
    Router::new()
        .route("/", get(root))
        .route("/users", post(create_user::<T>).get(all_user::<T>))
        .route("/users/{id}", get(find_user::<T>))
        .with_state(state)
        .layer(
            CorsLayer::new()
                .allow_origin("http://localhost:4001".parse::<axum::http::HeaderValue>().unwrap())
                .allow_methods(Any)
                .allow_headers(vec![CONTENT_TYPE, AUTHORIZATION]),
        )
}

async fn root() -> &'static str {
    "Hello, World!"
}