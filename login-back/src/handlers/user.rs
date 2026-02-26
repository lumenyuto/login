use axum::{
    extract::{Extension, Path},
    http::StatusCode,
    response::IntoResponse,
    Json,
};
use std::sync::Arc;
use crate::models::user::CreateUser;
use crate::repositories::user::UserRepository;
use super::ValidatedJson;

pub async fn create_user<T: UserRepository>(
    ValidatedJson(payload): ValidatedJson<CreateUser>,
    Extension(repository): Extension<Arc<T>>,
) -> Result<impl IntoResponse, StatusCode> {
    let user = repository
        .create(payload)
        .await
        .or(Err(StatusCode::NOT_FOUND))?;

    Ok((StatusCode::CREATED, Json(user)))
}

pub async fn find_user<T: UserRepository>(
    Path(id): Path<i32>,
    Extension(repository): Extension<Arc<T>> ,
) -> Result<impl IntoResponse, StatusCode> {
    let todo = repository
        .find(id)
        .await
        .or(Err(StatusCode::NOT_FOUND))?;
    Ok((StatusCode::OK, Json(todo)))
}

pub async fn all_user<T: UserRepository>(
    Extension(repository): Extension<Arc<T>>,
) -> Result<impl IntoResponse, StatusCode> {
    let labels = repository
        .all()
        .await
        .unwrap();
    Ok((StatusCode::OK, Json(labels)))
}