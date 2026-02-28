import type { NewUserPayload, User } from '../types/user'

// 変更点1: 引数に `token: string` を追加する
export const addUserItem = async (payload: NewUserPayload, token: string) => {
    const res = await fetch('http://localhost:4000/users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
    })
    if (!res.ok) {
        throw new Error('add user request failed')
    }
    const json: User = await res.json()
    return json
}

export const getUserItems = async (token: string) => {
    const res = await fetch('http://localhost:4000/users', {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
    if (!res.ok) {
        throw new Error('get user request failed')
    }

    const json: User[] = await res.json()
    return json
}