export type User = {
    id: number
    name: string
    sub: string | null
    email: string | null
}

export type CreateUserPayload = {
    sub: string
    name: string
    email: string
}