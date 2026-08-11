import type {StructureResolver} from 'sanity/structure'
import {DashboardIcon} from '@sanity/icons/Dashboard'
import {orderableDocumentListDeskItem} from '@sanity/orderable-document-list'
import {pages} from './schemaTypes/pages'

// Define singleton document IDs here
const singletonTypes = ['site', ...pages.map((page) => page.name)]
const definitions = ['category']

// Add other types you want to hide from Desk here
const hiddenTypes = [...singletonTypes, ...definitions, 'project', 'press', 'mux.videoAsset']

export const structure: StructureResolver = (S, context) =>
  S.list()
    .title('Content')
    .items([
      // Top-level singleton
      S.listItem()
        .id('site')
        .title('Site')
        .icon(DashboardIcon)
        .child(S.document().schemaType('site').documentId('site')),

      ...pages.map((page) =>
        S.listItem()
          .id(page.name)
          .title(page.title || page.name)
          .child(S.document().schemaType(page.name).documentId(page.name)),
      ),

      S.divider(),

      orderableDocumentListDeskItem({
        type: 'project',
        title: 'Projects',
        S,
        context,
      }),

      orderableDocumentListDeskItem({
        type: 'press',
        title: 'Press',
        S,
        context,
      }),

      S.divider(),

      // Everything else (exclude hidden types and the ones we added above)
      ...S.documentTypeListItems().filter((listItem) => !hiddenTypes.includes(listItem.getId()!)),
    ])
