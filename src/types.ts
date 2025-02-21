export interface Path {
    alias: string
    pid: number
    langcode: string
}

export interface DrupalNode extends Record<string, any> {
    id: string
    type: string
    langcode: string
    status: boolean
    drupal_internal__nid: number
    drupal_internal__vid: number
    changed: string
    created: string
    title: string
    default_langcode: boolean
    sticky: boolean
    path: Path
}
