export const APP_IP = "127.0.0.1:5000";

export function post_request(url, data, auth = "", callback = null) {
  var req = new XMLHttpRequest();
  req.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200 && callback) {
      callback(req.responseText);
    }
  };
  req.open("POST", url, false);
  req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  if (auth) {
    req.setRequestHeader("authorization", auth);
  }
  req.send(data);
  return req.responseText;
}
export function get_request(url, auth = "", callback = null) {
  var req = new XMLHttpRequest();
  req.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      callback(req.responseText);
    }
  };
  req.open("GET", url, false);
  req.setRequestHeader(
    "Content-type",
    "application/x-www-form-urlencoded",
    "authorization: YOUR-API-TOKEN"
  );
  if (auth) {
    req.setRequestHeader("authorization", auth);
  }
  req.send();
  return req.responseText;
}

export function assembly_ai_intitial_request(audio_url) {
  var response = post_request(
    "https://api.assembly.ai/v2/transcript",
    (auth = "YOUR-API-TOKEN"),
    {
      audio_url: audio_url,
    }
  );
}

export function poll_assembly_ai_transcript(transcript_id) {
  var response = post_request(
    "https://api.assembly.ai/v2/transcript/" + transcript_id
  );
  return response["status"] == "completed";
}
