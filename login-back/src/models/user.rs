use validator::Validate;
use sqlx::FromRow;
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Clone, PartialEq, Eq, FromRow)]
pub struct User {
    pub id: i32,
    pub name: String,
    pub sub: Option<String>,
    pub email: Option<String>,
}

#[derive(Debug, Serialize, Deserialize, Clone, PartialEq, Eq, Validate)]
pub struct CreateUser {
    #[validate(length(min = 1, message = "Can not be empty"))]
    pub sub: String,
    #[validate(length(min = 1, message = "Can not be empty"))]
    pub name: String,
    #[validate(length(min = 1, message = "Can not be empty"))]
    pub email: String,
}