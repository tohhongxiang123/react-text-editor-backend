import { pageDb } from '../../db'
import makeAddPage from './add-page'
import makeDeletePage from './delete-page'
import makeUpdatePage from './update-page'
import makeFindPages from './find-pages'

const addPage = makeAddPage(pageDb)
const deletePage = makeDeletePage(pageDb)
const updatePage = makeUpdatePage(pageDb)
const findPages = makeFindPages(pageDb)

export {
    addPage,
    deletePage,
    updatePage,
    findPages
}

