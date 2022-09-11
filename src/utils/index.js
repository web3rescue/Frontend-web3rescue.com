import { Alert, Snackbar } from "@mui/material";

export function copyToClipboard(text, cb) {
  var textArea = document.createElement("textarea");
  textArea.value = text;
  document.body.appendChild(textArea);
  textArea.select();
  document.execCommand("copy");
  textArea.remove();
  cb();
}

export function showAlert(message, type) {
  return (
    <Snackbar open={showAlert} autoHideDuration={6000}>
      <Alert severity={type} sx={{ width: "100%" }}>
        {message}
      </Alert>
    </Snackbar>
  );
}

export function debounceSearch(search, delay) {
  let timer;
  return function (e) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      search(e.target.value);
    }, delay);
  };
}
