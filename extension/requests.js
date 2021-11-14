export const APP_IP = "127.0.0.1:5000";

export async function post_request_image(url, image_url) {
  return fetch(url, {
    body: "image_uri="+image_url,
    mode: "no-cors",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    method: "POST"
  }).then(response => response.json())
}

export async function post_request_text(url, text) {
  return fetch(url, {
    body: "text="+text,
    mode: "no-cors",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    method: "POST"
  }).then(response => response.json())
}
