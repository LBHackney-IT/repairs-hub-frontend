export interface Errors {
    selectedOption?: string
    reasonToClose?: string
    closedDate?: string
    workOrderReferences?: string
}

export interface RadioInputOption {
    text: string
    value: string
}

export interface CloseWorkOrdersRequest {
    reason: string,
      completionDate: string,
      workOrderReferences: Array<string>,
}