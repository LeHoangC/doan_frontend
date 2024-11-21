export type QueryOptions = {
    limit?: number;
    page?: number
}

export type CommentQueryoptions = QueryOptions & {
    postId: string
}

export type LoginType = {
    email: string;
    password: string;
}

export type RegisterType = {
    name: string,
    email: string;
    password: string;
}

export type AuthResponse = {
    message: string,
    metadata: {
        tokens: Tokens,
        user: User
    },
    status: number
}

type Tokens = {
    accessToken: string,
    refreshToken: string
}

type User = {
    _id: string,
    name: string,
    email: string
}

export type PostType = {
    _id: string,
    post_commentCount: number,
    post_content?: string,
    post_likeCount: number,
    createdAt: string,
    post_likes: { [key: string]: boolean },
    post_type: string,
    post_userId: any,
    post_picturePath?: string
}