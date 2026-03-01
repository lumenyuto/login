use axum::{
    extract::{Path, State},
    http::StatusCode,
    response::IntoResponse,
    Json,
};
use std::sync::Arc;
use crate::auth::AuthenticatedUser;
use crate::models::user::CreateUser;
use crate::repositories::user::UserRepository;
use super::ValidatedJson;

pub async fn create_user<T: UserRepository>(
    _user: AuthenticatedUser,
    State(repository): State<Arc<T>>,
    ValidatedJson(payload): ValidatedJson<CreateUser>,
) -> Result<impl IntoResponse, StatusCode> {
    let user = repository
        .create(payload)
        .await
        .or(Err(StatusCode::INTERNAL_SERVER_ERROR))?;
    Ok((StatusCode::OK, Json(user)))
}

pub async fn find_user<T: UserRepository>(
    _user: AuthenticatedUser,
    Path(id): Path<i32>,
    State(repository): State<Arc<T>>,
) -> Result<impl IntoResponse, StatusCode> {
    let user = repository
        .find(id)
        .await
        .or(Err(StatusCode::NOT_FOUND))?;
    Ok((StatusCode::OK, Json(user)))
}

pub async fn all_user<T: UserRepository>(
    _user: AuthenticatedUser,
    State(repository): State<Arc<T>>,
) -> Result<impl IntoResponse, StatusCode> {
    let users = repository
        .all()
        .await
        .or(Err(StatusCode::INTERNAL_SERVER_ERROR))?;
    Ok((StatusCode::OK, Json(users)))
}