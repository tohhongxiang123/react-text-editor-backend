import { IPageDB, Page } from '../../db/Page'

export default (db: IPageDB) => async (_id: string, updatedInfo: Page) => {
    const pages = await db.find({_id})

    if (pages.length < 0) throw new Error(`Page ${_id} not found`)

    const updatedPage = {
        ...pages[0], ...updatedInfo
    }

    const response = await db.update(_id, updatedPage)
    return response
}