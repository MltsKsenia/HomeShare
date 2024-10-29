export interface Item {
    id: number;
    user_id: number;
    name: string;
    description: string;
    category: string;
    image_url: string;
    available_days: any;
    created_at: string;
    updated_at: string;
}

export interface User {
    id: number;
    username: string;
    email: string;
    profile_image_url?: string;
}

export interface ItemCardData {
    id: number;
    name: string;
    description: string;
    category: string;
    image_url: string;
    user_id: number;
    profile?: ProfileFormData;
}

export interface ProfileFormData {
    phone_number: string;
    full_name: string;
    address: string;
    profile_image_url: string;
    date_of_birth: string;
}
