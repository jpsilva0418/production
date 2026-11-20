Instagram reels/videos were not downloaded.

Unauthenticated access to @karolaynesouzabeauty.us posts and reels was blocked
on 2026-11-20 (America/New_York). instaloader, gallery-dl, yt-dlp, and the
public web_profile_info endpoint all redirected to Instagram login. Highlights
could not be opened without login. Third-party viewers (Imginn, Dumpor, AnonyIG,
Pixnoy) were blocked or showed bot checks and returned no media.

The profile metadata does indicate the account is public and has clips/reels
(has_any_clips: true). JP will need to open Instagram in a browser (or export
from the Instagram app / a logged-in session) to pull reels, post images,
carousel items, captions, and highlight videos.

When those files are available, compress with something like:

  ffmpeg -i input.mp4 -vf "scale='if(gt(iw,ih),-2,720)':'if(gt(iw,ih),720,-2)'"     -c:v libx264 -preset medium -crf 30 -c:a aac -b:a 64k output.mp4

and add them under this videos/ folder (or a second zip if the main zip would
exceed 30MB).
