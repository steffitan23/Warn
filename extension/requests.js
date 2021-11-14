export const APP_IP = "http://127.0.0.1:5000";

export async function post_request_image(url, image_uri) {
  return fetch(url, {
    body: "image_uri="+image_uri,
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
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    method: "POST"
  }).then(response => response.json())
}

function initial_assembly_req(url) {
  return fetch(APP_IP + "/assembly", {
    mode: "no-cors",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
  body: "audio_url="+url,
  method: "POST"
})
}

function poll_assembly(id) {
  return fetch(APP_IP + "/assemblyPoll", {
    body: "id="+id,
    mode: "no-cors",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    method: "POST"
  })
}

async function request_Assembly(url) {
  const delay = ms => new Promise(res => setTimeout(res, ms));
  let delay_time = 0;
  let response = await initial_assembly_req(url);
  console.log(response);
  let id = response.json().id;
  let poll_response = await poll_assembly(id);
  while((poll_response.status != "completed" || poll_response.status != "failed") && delay_time < 2) {
    await delay(5000);
    poll_response = await poll_assembly(id);
    delay_time += 1;
  }
  return poll_response.json();
}
