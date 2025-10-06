export const DataCleaner = (data: any) => {
    if (data.Id !== undefined) {
        delete data.Id;
    }
    if (data.Createduser !== undefined) {
        delete data.Createduser;
    }
    if (data.Createtime !== undefined) {
        delete data.Createtime;
    }
    if (data.Updateduser !== undefined) {
        delete data.Updateduser;
    }
    if (data.Updatetime !== undefined) {
        delete data.Updatetime;
    }
    if (data.Deleteduser !== undefined) {
        delete data.Deleteduser;
    }
    if (data.Deletetime !== undefined) {
        delete data.Deletetime;
    }
    return data
}