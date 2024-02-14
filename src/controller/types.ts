export interface User {
    id: string,
    name: string;
    city: string;
    mobile: number;
    created_at: string;
    updated_at: string;
}
  
export interface UserList {
    users: User[];
}