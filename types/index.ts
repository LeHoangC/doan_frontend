export type QueryOptions = {
    limit?: number;
    page?: number
}

export type CommentQueryoptions = QueryOptions & {
    postId: string;
    parentCommentId?: string
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
        user: User,
    },
    status: number
}

export type Tokens = {
    accessToken: string,
    refreshToken: string
}

export type User = {
    _id: string,
    name: string,
    location: string
    education?: string
    email: string
    picturePath?: string
    slug: string,
    friends: string[]
    gender?: 'male' | 'female' | 'other';
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