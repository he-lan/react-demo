import React, {useEffect, useRef, useState} from "react";
import './style.scss';

const deleteHTMLTag = (html: string) => {
  if(!html) { return '' };
  return html.replace(/<[^>]+>/g, '');
}

const spliceHTMLByteLimit = (html: string, limit: number) => {
  let byteCount = 0;
  for(let i = 0; i < html.length; i++) {
    const chart = html.charAt(i);
    // eslint-disable-next-line no-control-regex
    if(/^[\u0000-\u00ff]$/.test(chart)) {
      byteCount += 1.5;
    } else {
      byteCount += 2;
    }
    if(byteCount > limit) {
      return html.slice(0, i) + '...';
    }
  }
  return html;
}

const ByteFoldCard = ({html, byte=120}: {html: string, byte?: number}) => {
  const [isLong, isLongSet] = useState(false);
  const [isFold, isFoldSet] = useState(true);

  const content = deleteHTMLTag(html);
  const shortContent = spliceHTMLByteLimit(content, byte);

  useEffect(() => {
    const isLong = content.length > shortContent.length
    isLongSet(isLong);
    isFoldSet(isLong ? true : false);
  }, [])

  return (
    <div className="bktrade-fold_card-byte">
      <span dangerouslySetInnerHTML={{__html: isFold ? shortContent : content}}></span>
      { isLong ? <span className="action" onClick={() => isFoldSet(val => !val)}>{ isFold ? '展开' : '折叠' }</span> : null }
    </div>
  )
}

export const LineFoldCard = ({html, line = 3, lineHeight='24px'}: {html: string, line?: number, lineHeight?: string}) => {
  const wrapRef: any = useRef(null);
  const contentRef: any = useRef(null);
  const [ isFold, isFoldSet ] = useState(true);
  const [ isLong, isLongSet ] = useState(false);

  const content = (isLong && isFold) ? deleteHTMLTag(html) : html;

  useEffect(() => {
    if(!wrapRef.current || !contentRef.current) { return; }
    const target = contentRef.current;
    const height = target.getBoundingClientRect().height;
    const style = window.getComputedStyle(target);
    const lineHeight = parseFloat(style.lineHeight);
    
    wrapRef.current.style.maxHeight = lineHeight * line + 'px';
    isLongSet(height > lineHeight * line);
  }, [wrapRef, contentRef, line])

  const clickHandler = () => {
    isFoldSet(val => !val);
    const style = window.getComputedStyle(contentRef.current);
    const lineHeight = parseFloat(style.lineHeight);
    wrapRef.current.style.maxHeight = isFold ? 'unset' : lineHeight*line + 'px'
  }

  return (
    <div className="bktrade-fold_card-line">
      <div className="bktrade-fold_card-line-content" ref={wrapRef} style={{lineHeight}}>
        { isLong ? <span className="action" onClick={() => clickHandler()}>&nbsp;{ isFold ? `... ['展开']` : `['收起']` } </span> : null }
        <span ref={contentRef} style={{lineHeight}} dangerouslySetInnerHTML={{__html: content}}></span>
      </div>
    </div>
  )
}

interface IFoldCard {
  html: string;
  model: 'line' | 'byte';
  line?: number;
  lineHeight?: number | string;
  byte?: number;
}
export const FoldCard = ({html, model, line = 3, lineHeight = '24px', byte = 120}: IFoldCard) => {
  return (
    <div className="bktrade-fold_card">
      { model === 'byte' ? <ByteFoldCard html={html} byte={byte} /> : null }
      { model === 'line' ? <LineFoldCard html={html} line={line} /> : null }
    </div>
  )
}