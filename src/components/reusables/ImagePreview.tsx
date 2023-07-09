import Image from 'next/image'

interface Props {
  src: string;
  alt: string;
}

/**
 * Component for expanding the view of an image
 * 
 * @param src source of an image
 * @param alt alt of an image
 * @returns 
 */
export default function ImagePreview(props: Props) {
  return (
    <div>
      <div id="image-container">
        <Image src={props.src} fill alt={props.alt} />
      </div>
    </div>
  )
}
