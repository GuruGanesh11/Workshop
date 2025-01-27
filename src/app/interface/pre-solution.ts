export interface SolutionType {
    name: string;
}

export interface CategoryQuestions {
    [category: string]: Question[];
}

export interface Question {
    question: string;
    category: string;
    is_relevant: boolean;
    question_id: string;
    is_edited: boolean;
    is_deleted: boolean;
    is_manual: boolean;
    original_question: string;
    modified: boolean;
    tag: string;
    checked: boolean;
}