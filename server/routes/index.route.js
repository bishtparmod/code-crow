const express = require("express");
const router = express.Router(); // eslint-disable-line new-cap
const path = require("path");
const authRoutes = require("./auth.route");
const githubRoutes = require("./github.route");
const gitlabRoutes = require("./gitlab.route");
const bitbucketRoutes = require("./bitbucket.route");
const notificationsRoutes = require("./notifications.routes");
const channelRoutes = require("./channel.routes");
const twilioRoutes = require("./twilio.routes");
const pagesRoutes = require("./pages.routes");
const rolesRoutes = require("./roles.routes");
const liveStreamingRoutes = require("./liveStreaming.routes");
const emailRoutes = require("./email.routes");
const paymentRoutes = require("./payments.routes");
const friendsRoutes = require("./friends.routes");
const userRoutes = require("./user.routes");
const newsRoutes = require("./news.routes");
const videoRoutes = require("./video.routes");
const playlistRoutes = require("./playlist.routes");
const mediaRoutes = require("./media.route");
const S3Routes = require("./s3.routes");
const siteSettingsRoutes = require("./siteSettings.routes");
const legalRoutes = require("./legal.routes");
const groupRoutes = require("./group.route");
const videoPartsRoutes = require('./videoPart.routes')
const streamTimeRoutes = require('./streamTime.routes')

/** GET /health-check - Check service health */
router.get("/health-check", (req, res) => res.send("OK"));
router.get("/js/ads.js", (req, res) => {
  res.send(true);
  // res.sendFile(path.join(__dirname, 'js/' + 'ads.js'))
});
router.use("/auth", authRoutes);
router.use("/github", githubRoutes);
router.use("/gitlab", gitlabRoutes);
router.use("/bitbucket", bitbucketRoutes);
router.use("/notifications", notificationsRoutes);
router.use('/video-parts', videoPartsRoutes);
router.use("/twilio", twilioRoutes);
router.use("/channel", channelRoutes);
router.use("/pages", pagesRoutes);
router.use("/roles", rolesRoutes);
router.use("/email", emailRoutes);
router.use("/liveStreaming", liveStreamingRoutes);
router.use("/payments", paymentRoutes);
router.use("/friends", friendsRoutes);
router.use("/groups", groupRoutes);
router.use("/users", userRoutes);
router.use("/news", newsRoutes);
router.use("/video", videoRoutes);
router.use("/playlists", playlistRoutes);
router.use("/media", mediaRoutes);
router.use("/s3", S3Routes);
router.use("/siteSettings", siteSettingsRoutes);
router.use("/legal", legalRoutes);
router.use("/stream-time", streamTimeRoutes);

module.exports = router;
