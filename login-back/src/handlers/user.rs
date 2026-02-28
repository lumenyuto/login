use axum::{
    extract::{Extension, Path},
    http::StatusCode,
    response::IntoResponse,
    Json,
};
use std::sync::Arc;
use crate::auth::AuthenticatedUser;
use crate::models::user::CreateUser;
use crate::repositories::user::UserRepository;
use super::ValidatedJson;

pub async fn find_user<T: UserRepository>(
    _user: AuthenticatedUser,
    Path(id): Path<i32>,
    Extension(repository): Extension<Arc<T>>,
) -> Result<impl IntoResponse, StatusCode> {
    let todo = repository
        .find(id)
        .await
        .or(Err(StatusCode::NOT_FOUND))?;
    Ok((StatusCode::OK, Json(todo)))
}

pub async fn all_user<T: UserRepository>(
    _user: AuthenticatedUser,
    Extension(repository): Extension<Arc<T>>,
) -> Result<impl IntoResponse, StatusCode> {
    let labels = repository
        .all()
        .await
        .unwrap();
    Ok((StatusCode::OK, Json(labels)))
}

pub async fn create_user<T: UserRepository>(
    _user: AuthenticatedUser,
    ValidatedJson(payload): ValidatedJson<CreateUser>,
    Extension(repository): Extension<Arc<T>>,
) -> Result<impl IntoResponse, StatusCode> {
    let user = repository
        .upsert_by_sub(payload)
        .await
        .or(Err(StatusCode::INTERNAL_SERVER_ERROR))?;

    Ok((StatusCode::OK, Json(user)))
}