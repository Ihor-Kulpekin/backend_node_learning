export enum ExportFileStatusEnum {
    IN_QUEUE = 'In queue',
    DOWNLOADING = 'Downloading',
    COMPRESSION = 'Compression',
    COMPRESSION_FINISHED = 'Compression finished',
    SENDIGN_TO_AWS = 'Sending to AWS',
    DONE = 'Done',
    CANCEL = 'Cancel',
    ERROR = 'Error'
}
