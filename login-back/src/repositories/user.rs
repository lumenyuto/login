use axum::async_trait;
use sqlx::PgPool;
use tokio::sync::oneshot;
use crate::models::user::{CreateUser, User};
use super::RepositoryError;

#[async_trait]
pub trait UserRepository: Clone + std::marker::Send + std::marker::Sync + 'static {
    async fn create(&self, payload: CreateUser) -> anyhow::Result<User>;
    async fn find(&self, id: i32) -> anyhow::Result<User>;
    async fn all(&self) -> anyhow::Result<Vec<User>>;
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

#[async_trait]
impl UserRepository for UserRepositoryForDb {
    async fn create(&self, payload: CreateUser) -> anyhow::Result<User> {
        let optional_user = sqlx::query_as::<_, User>(
            r#"
select * from users where name= $1
        "#,
        )
        .bind(payload.name.clone())
        .fetch_optional(&self.pool)
        .await?;

        if let Some(user) = optional_user {
            return Err(RepositoryError::Duplicate(user.id).into());
        }

        let user = sqlx::query_as::<_, User>(
            r#"
insert into users ( name )
values ( $1 )
returning *
        "#,
        )
        .bind(payload.name.clone())
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