export interface GenerateQuestionForm {
    additional_context: string
  }
  
  export interface QuestionDetails {
    analysis: Analysis[]
    architecture: Architecture[]
    deployment: Deployment[]
    design: Design[]
    development: Development[]
    financial_considerations: FinancialConsideration[]
    functional_requirements: FunctionalRequirement[]
    maintenance: Maintenance[]
    planning: Planning[]
    testing: Testing[]
  }
  
  export interface Analysis {
    category: string
    checked: boolean
    is_deleted: boolean
    is_edited: boolean
    is_manual: boolean
    is_relevant: boolean
    modified: boolean
    original_question: string
    question: string
    question_id: string
    tag: string
  }
  
  export interface Architecture {
    category: string
    checked: boolean
    is_deleted: boolean
    is_edited: boolean
    is_manual: boolean
    is_relevant: boolean
    modified: boolean
    original_question: string
    question: string
    question_id: string
    tag: string
  }
  
  export interface Deployment {
    category: string
    checked: boolean
    is_deleted: boolean
    is_edited: boolean
    is_manual: boolean
    is_relevant: boolean
    modified: boolean
    original_question: string
    question: string
    question_id: string
    tag: string
  }
  
  export interface Design {
    category: string
    checked: boolean
    is_deleted: boolean
    is_edited: boolean
    is_manual: boolean
    is_relevant: boolean
    modified: boolean
    original_question: string
    question: string
    question_id: string
    tag: string
  }
  
  export interface Development {
    category: string
    checked: boolean
    is_deleted: boolean
    is_edited: boolean
    is_manual: boolean
    is_relevant: boolean
    modified: boolean
    original_question: string
    question: string
    question_id: string
    tag: string
  }
  
  export interface FinancialConsideration {
    category: string
    checked: boolean
    is_deleted: boolean
    is_edited: boolean
    is_manual: boolean
    is_relevant: boolean
    modified: boolean
    original_question: string
    question: string
    question_id: string
    tag: string
  }
  
  export interface FunctionalRequirement {
    category: string
    checked: boolean
    is_deleted: boolean
    is_edited: boolean
    is_manual: boolean
    is_relevant: boolean
    modified: boolean
    original_question: string
    question: string
    question_id: string
    tag: string
  }
  
  export interface Maintenance {
    category: string
    checked: boolean
    is_deleted: boolean
    is_edited: boolean
    is_manual: boolean
    is_relevant: boolean
    modified: boolean
    original_question: string
    question: string
    question_id: string
    tag: string
  }
  
  export interface Planning {
    category: string
    checked: boolean
    is_deleted: boolean
    is_edited: boolean
    is_manual: boolean
    is_relevant: boolean
    modified: boolean
    original_question: string
    question: string
    question_id: string
    tag: string
  }
  
  export interface Testing {
    category: string
    checked: boolean
    is_deleted: boolean
    is_edited: boolean
    is_manual: boolean
    is_relevant: boolean
    modified: boolean
    original_question: string
    question: string
    question_id: string
    tag: string
  }
  
  export interface QuestionsResponse {
    is_success: boolean
    data: Datum[]
  }
  
  export interface Datum {
    question: string
    category: string
    is_relevant: boolean
    question_id: string
    is_edited: boolean
    is_deleted: boolean
    is_manual: boolean
  }
  