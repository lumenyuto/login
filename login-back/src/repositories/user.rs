use std::future::Future;
use sqlx::PgPool;
use crate::models::user::{CreateUser, User};

pub trait UserRepository: Clone + std::marker::Send + std::marker::Sync + 'static {
    fn create(&self, payload: CreateUser) -> impl Future<Output = anyhow::Result<User>> + Send;
    fn find(&self, id: i32) -> impl Future<Output = anyhow::Result<User>> + Send;
    fn all(&self) -> impl Future<Output = anyhow::Result<Vec<User>>> + Send;
}

#[derive(Debug, Clone)]
pub struct UserRepositoryForDb {
    pool: PgPool,
}

impl UserRepositoryForDb {
    pub fn new(pool: PgPool) -> Self {
        Self { pool }
    }
}

impl UserRepository for UserRepositoryForDb {
    async fn create(&self, payload: CreateUser) -> anyhow::Result<User> {
        let user = sqlx::query_as::<_, User>(
            r#"
INSERT INTO users (sub, name, email)
VALUES ($1, $2, $3)
ON CONFLICT (sub) DO UPDATE SET name = $2, email = $3
RETURNING *
            "#,
        )
        .bind(&payload.sub)
        .bind(&payload.name)
        .bind(&payload.email)
        .fetch_one(&self.pool)
        .await?;

        Ok(user)
    }
    
    async fn find(&self, id: i32) -> anyhow::Result<User> {
        let user = sqlx::query_as::<_, User>(
            r#"
SELECT * FROM users WHERE id = $1
        "#,
        )
        .bind(id)
        .fetch_one(&self.pool)
        .await?;

        Ok(user)
    }

    async fn all(&self) -> anyhow::Result<Vec<User>> {
        let users = sqlx::query_as::<_, User>(
            r#"
select * from users
order by users.id asc;
        "#,
        )
        .fetch_all(&self.pool)
        .await?;

    Ok(users)
    }
}