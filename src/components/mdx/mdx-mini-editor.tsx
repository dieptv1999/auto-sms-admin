import {
    BlockTypeSelect,
    BoldItalicUnderlineToggles,
    CreateLink,
    headingsPlugin,
    imagePlugin,
    InsertImage,
    InsertTable,
    linkDialogPlugin,
    linkPlugin,
    listsPlugin,
    markdownShortcutPlugin,
    MDXEditor,
    quotePlugin,
    tablePlugin,
    thematicBreakPlugin,
    toolbarPlugin,
    UndoRedo
} from '@mdxeditor/editor'
import React, {FC} from "react";
import {AxiosError, AxiosResponse, HttpStatusCode} from "axios";
import {toast} from "@/components/ui/use-toast.ts";
import {RepositoryFactory} from "@/api/repository-factory.ts";

const FileRepository = RepositoryFactory.get('file')

interface EditorProps {
    value: string,
    onChange: (v: string) => void,
    placeholder?: string | undefined,
    contentClassName?: string;
}

/**
 * Extend this Component further with the necessary plugins or props you need.
 * proxying the ref is necessary. Next.js dynamically imported components don't support refs.
 */
const Editor: FC<EditorProps> = React.forwardRef(({value, onChange, placeholder, contentClassName = 'h-[200px]'}: EditorProps, ref: any) => {
    return (
        <MDXEditor
            ref={ref}
            className={'border rounded-lg prose-sm md:prose !max-w-full'}
            onChange={onChange}
            markdown={value}
            contentEditableClassName={`${contentClassName} overflow-y-auto py-2 whitespace-normal editor-content`}
            placeholder={placeholder ?? ''}
            plugins={[
                toolbarPlugin({
                    toolbarContents: () => (
                        <>
                            {' '}
                            <UndoRedo/>
                            <BoldItalicUnderlineToggles/>
                            <BlockTypeSelect/>
                            <CreateLink/>
                            <InsertImage/>
                            <InsertTable/>
                        </>
                    )
                }),
                headingsPlugin(),
                listsPlugin(),
                quotePlugin(),
                thematicBreakPlugin(),
                markdownShortcutPlugin(),
                tablePlugin(),
                imagePlugin({
                    imageUploadHandler: (image: File) => {
                        return new Promise((resolve, reject) => {
                            let fileReq = new FormData();
                            fileReq.set('file', image)
                            FileRepository.localUpload(fileReq)
                                .then((resp: AxiosResponse) => {
                                    if (resp.status === HttpStatusCode.Created) {
                                        resolve(resp.data)
                                    } else {
                                        reject(0)
                                    }
                                })
                                .catch((err: AxiosError) => {
                                    console.debug(err)
                                    toast({
                                        title: 'Có lỗi xảy ra khi upload file',
                                        variant: 'default',
                                    })
                                })
                        })
                    },
                }),
                linkPlugin(),
                linkDialogPlugin(),
            ]}
        />
    );
});

export default Editor;