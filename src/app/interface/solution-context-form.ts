export interface SolutionContextForm {
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
  }
  