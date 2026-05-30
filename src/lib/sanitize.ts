import DOMPurify from 'isomorphic-dompurify';

export function sanitizeHtml(dirty: string | null | undefined): string {
    if (!dirty) return '';
    return DOMPurify.sanitize(dirty, {
        ALLOWED_TAGS: [
            'b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li',
            'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'img',
            'table', 'thead', 'tbody', 'tr', 'th', 'td', 'iframe',
            'span', 'div', 'section', 'article', 'figure', 'figcaption'
        ],
        ALLOWED_ATTR: [
            'href', 'src', 'alt', 'title', 'class', 'style', 'target',
            'rel', 'allow', 'allowfullscreen', 'frameborder', 'width', 'height',
            'data-instgrm-permalink', 'data-instgrm-version', 'cite', 'data-video-id' // For social embeds
        ],
        ADD_TAGS: ['iframe', 'blockquote'], // Ensure embeds work
    });
}
