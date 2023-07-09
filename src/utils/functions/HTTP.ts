// "use client"

import {useRouter} from 'next/navigation'
export interface HttpResponse<I> extends Response {
  parsedBody?: I;
}

/**
 * A utiltity function that returns a typed response body based on the Interface it is fed
 * learn more: https://www.carlrippon.com/fetch-with-async-await-and-typescript/#:~:text=To%20get%20the%20response%20body%2C%20we%20call%20the,responses%20json%20method%3A%20const%20body%20%3D%20await%20response.json%28%29%3B
 */
export async function CustomHttpRequest<I>(
  request: RequestInfo,
  requestOptions: RequestInit | undefined
): Promise<HttpResponse<I>> {
  // const router = useRouter()
  const response: HttpResponse<I> = await fetch(request, requestOptions);

  try {
    // may error if there is no body
    response.parsedBody = await response.json();
    return response;
  } catch (err) {
    console.log(err)
  //  if (response.status === 401) {
  //   router.push('/')
  //  }
    throw new Error(response.statusText)
  }
}