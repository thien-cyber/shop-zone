import { SetMetadata } from '@nestjs/common';

// Tạo một custom decorator để đánh dấu các route là public (không cần authentication)
export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
