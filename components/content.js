import Link from 'next/link';

const ContentHeader = (props) => {
  return (
    <h1 class="font-bold text-white text-4xl text-center pt-20">{props.title}</h1>
  )
};

const ContentBody = (props) => {
  return (
    <div class="flex justify-center p-20">
      {props.textElement}
    </div>
  );
}

const ContentPage = (props) => {
  return (
    <div class="h-screen bg-gradient-to-r from-gray-900 to-black">
      <ContentHeader title={props.title} />
      <ContentBody textElement={props.textElement} />
      <Link href={props.nextLink}>
        <a class="block text-center mx-auto text-gray-100 text-2xl">
          {props.nextLinkText}
        </a>
      </Link>
    </div>
  );
};

export {
  ContentBody,  
  ContentHeader,
  ContentPage
}; 
