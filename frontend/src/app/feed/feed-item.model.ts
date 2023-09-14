import { Post } from '../../../../backend/src/models/post.model';

type FeedItem = {
    authorId: number;
    postId: number;
    authorUsername: string;
    authorName: string;
    rate: number,
    game: string,
    content: string;
    date: string;
    type: string;
}

export { FeedItem };