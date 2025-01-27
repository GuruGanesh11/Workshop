export interface SelectedContextData {
    created_by: string
    updated_by: any
    created_at: string
    updated_at: string
    id: string
    solution_id: string
    input_context: InputContext
    additional_context: AdditionalContext
  }
  
  export interface InputContext {
    industry: string
    problem_statement: string
    vision: string
    target_audience: string
    key_roles: string
    additional_info: string
  }
  
  export interface AdditionalContext {
    files: string[]
    additional_context: string
    number_of_questions: number
  }
  