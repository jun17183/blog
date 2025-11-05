'use client'
import ReactMarkdown, { Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import { useAtom } from 'jotai';
import { darkModeAtom } from '@/atoms/blogAtoms';

// 컴포넌트 imports
import { CodeComponent } from './preview/CodeComponent';
import { TableComponent, ThComponent, TdComponent } from './preview/TableComponents';
import { 
  BlockquoteComponent, 
  LinkComponent, 
  ParagraphComponent, 
  StrongComponent, 
  EmComponent, 
  DelComponent 
} from './preview/TextComponents';
import { 
  H1Component, 
  H2Component, 
  H3Component, 
  H4Component, 
  H5Component, 
  H6Component 
} from './preview/HeadingComponents';
import { UlComponent, OlComponent, LiComponent } from './preview/ListComponents';
import { ImageComponent } from './preview/ImageComponent';

interface MarkdownPreviewProps {
  content: string;
  previewRef: React.RefObject<HTMLDivElement | null>;
  isEditable?: boolean;
  onImageResize?: (src: string, width: number) => void;
}

export default function MarkdownPreview({ content, previewRef, isEditable = false, onImageResize }: MarkdownPreviewProps) {
  const [isDarkMode] = useAtom(darkModeAtom);

  // 마크다운 컴포넌트 매핑
  const markdownComponents: Components = {
    code: CodeComponent,
    table: TableComponent,
    th: ThComponent,
    td: TdComponent,
    blockquote: BlockquoteComponent,
    a: LinkComponent,
    h1: H1Component,
    h2: H2Component,
    h3: H3Component,
    h4: H4Component,
    h5: H5Component,
    h6: H6Component,
    p: ParagraphComponent,
    ul: UlComponent,
    ol: OlComponent,
    li: LiComponent,
    strong: StrongComponent,
    em: EmComponent,
    del: DelComponent,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    img: (props) => (ImageComponent as any)({ ...props, isEditable, onImageResize }),
  };

  return (
    <div 
      ref={previewRef}
      className={`flex-1 p-6 ${
        isDarkMode 
          ? 'bg-gray-900' 
          : 'bg-white'
      }`}
    >
      {content ? (
        <div className={`prose prose-sm max-w-none ${
          isDarkMode 
            ? 'prose-invert prose-headings:text-white prose-p:text-gray-300 prose-strong:text-white prose-code:text-gray-300 prose-pre:bg-gray-800 prose-blockquote:text-gray-400 prose-ul:text-gray-300 prose-ol:text-gray-300 prose-li:text-gray-300' 
            : 'prose-gray prose-headings:text-gray-900 prose-p:text-gray-700 prose-strong:text-gray-900 prose-code:text-gray-800 prose-pre:bg-gray-100 prose-blockquote:text-gray-600 prose-ul:text-gray-700 prose-ol:text-gray-700 prose-li:text-gray-700'
        }`}>
          <ReactMarkdown
            remarkPlugins={[remarkGfm, remarkBreaks]}
            rehypePlugins={[rehypeHighlight, rehypeRaw]}
            components={markdownComponents}
          >
            {content}
          </ReactMarkdown>
        </div>
      ) : (
        <div className={`flex items-center justify-center h-full ${
          isDarkMode ? 'text-gray-400' : 'text-gray-500'
        }`}>
          <div className="text-center">
            <p className="text-lg mb-2">📝</p>
            <p>작성한 내용이 여기에 미리보기됩니다.</p>
            <p className="text-sm mt-2">마크다운 문법을 사용해보세요!</p>
          </div>
        </div>
      )}
    </div>
  );
}
