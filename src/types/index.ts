export interface Photo {
  id: string;
  title: string;
  photographer: string;
  location: string;
  date: string;
  price: number;
  imageUrl: string;
  description?: string;
  tags?: string[];
  coordinates?: {
    lat: number;
    lng: number;
  };
  likes?: number;
}

export interface LocationMarker {
  id: string;
  name: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  photoCount: number;
}

export interface User {
  id: string;
  username: string;
  email: string;
  favoriteSpot: string;
  userType: 'pro-photographer' | 'semi-pro-photographer' | 'amateur-photographer' | 'surf-school' | 'urban-surf-site' | 'river-surf-site' | 'business-buyer' | 'surf-enthusiast';
  interests: string[];
  location?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  bio?: string;
  createdAt: string;
}

export interface SurfSpot {
  id: string;
  name: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  photoCount: number;
  description: string;
  isWSL: boolean;
  createdBy?: string;
  createdAt?: string;
  albums?: Album[];
}

export interface Album {
  id: string;
  title: string;
  description: string;
  photos: Photo[];
  createdBy: string;
  createdAt: string;
  surfSpotId: string;
}