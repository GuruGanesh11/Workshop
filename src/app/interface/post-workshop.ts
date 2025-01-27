export interface UpdateQuestion {
    answer: string
    question_id: string
  }

  export interface UpdateEpicData {
    title: string
    description: string
  }

  export interface Epic {
    title: string
    description: string
  }

  export interface UpdateAdditionalContext {
    additional_context: string
  }

  export interface Question {
    question: string
    category: string
    is_relevant: boolean
    question_id: string
    is_edited: boolean
    is_deleted: boolean
    is_manual: boolean
    is_input_received: boolean
    is_validated: boolean
    answer: string
    selected?: boolean
  }

  export interface MediaFile {
    FileName: string;
    FileSize: string;
    FileType: string;
    FileUrl: any;
    FileProgressSize: number;
    FileProgress: number;
  }

  export interface UserInputSheet {
    id: number;
    name: string;
    fileUploaded: boolean;
    media: string[];
    required: boolean;
    deleted: boolean;
  }