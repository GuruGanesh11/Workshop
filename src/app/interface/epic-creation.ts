export interface Product {
  id: string;
  name: string;
  description: string;
  image: string;
  checked: boolean;
}
export interface UpdateEpicData {
  title: string
  description: string
}

export interface CreateEpicData {
  title: string
  description: string
}

export interface CreateFeature {
  id: string
  feature_id: string
  epic_id: string
  title: string
  description: string
}

export interface UpdateFeature {
  id: string
  feature_id: string
  epic_id: string
  title: string
  description: string
}