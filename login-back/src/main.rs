mod auth;
mod handlers;
mod models;
mod repositories;

use axum::{
    extract::Extension,
    routing::{get, post},
    Router,
};
use std::net::SocketAddr;
use std::{
    env,
    sync::Arc
};
use hyper::header::{AUTHORIZATION, CONTENT_TYPE};
use sqlx::PgPool;
use tower_http::cors::{Any, CorsLayer, Origin};
use dotenv::dotenv;
use crate::handlers::{
    user::{all_user, create_user, find_user},
};
use crate::repositories::{
    user::{UserRepository, UserRepositoryForDb}
};

#[tokio::main]
async fn main() {
    let log_level = env::var("RUST_LOG").unwrap_or("info".to_string());
    unsafe {
        env::set_var("RUST_LOG", log_level);
    }
    tracing_subscriber::fmt::init();
    dotenv().ok();

    let database_url = &env::var("DATABASE_URL").expect("undefined [DATABASE_URL]");
    tracing::debug!("start_connect database...");
    let pool = PgPool::connect(database_url)
        .await
        .expect(&format!("fail connect database, url is [{}]", database_url));

    let app = create_app(UserRepositoryForDb::new(pool.clone()));
    let addr = SocketAddr::from(([127, 0, 0,1], 4000));

    axum::Server::bind(&addr)
        .serve(app.into_make_service())
        .await
        .unwrap();

    fn create_app<T: UserRepository>(user_repository: T) -> Router {
        Router::new()
            .route("/", get(root))
            .route("/users", post(create_user::<T>).get(all_user::<T>))
            .route("/users/:id", get(find_user::<T>))
            .layer(Extension(Arc::new(user_repository)))
            .layer(
                CorsLayer::new()
                    .allow_origin(Origin::exact("http://localhost:4001".parse().unwrap()))
                    .allow_methods(Any)
                    .allow_headers(vec![CONTENT_TYPE, AUTHORIZATION]),
            )
    }
}

async fn root() -> &'static str {
    "Hello, World!"
}