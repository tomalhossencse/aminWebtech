// Add these endpoints to your existing server.js file

// Analytics Collections
const analyticsCollection = db.collection("analytics");
const visitorsCollection = db.collection("visitors");
const pageViewsCollection = db.collection("pageViews");

// -----------------------Analytics APIs---------------

// GET analytics overview
app.get("/analytics/overview", async (req, res) => {
  try {
    const { timeRange = "7d" } = req.query;
    
    // Calculate date range
    const now = new Date();
    let startDate;
    
    switch (timeRange) {
      case "1d":
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case "7d":
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case "30d":
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    }

    // Get total visitors
    const totalVisitors = await visitorsCollection.countDocuments({
      createdAt: { $gte: startDate }
    });

    // Get new visitors (first time visitors)
    const newVisitors = await visitorsCollection.countDocuments({
      createdAt: { $gte: startDate },
      isNewVisitor: true
    });

    // Get active visitors (last 5 minutes)
    const activeNow = await visitorsCollection.countDocuments({
      lastActivity: { $gte: new Date(now.getTime() - 5 * 60 * 1000) }
    });

    // Calculate bounce rate
    const totalSessions = await visitorsCollection.countDocuments({
      createdAt: { $gte: startDate }
    });
    
    const bouncedSessions = await visitorsCollection.countDocuments({
      createdAt: { $gte: startDate },
      pageViews: { $lte: 1 }
    });

    const bounceRate = totalSessions > 0 ? ((bouncedSessions / totalSessions) * 100).toFixed(1) : 0;

    res.send({
      totalVisitors,
      newVisitors,
      activeNow,
      bounceRate: `${bounceRate}%`
    });
  } catch (error) {
    res.status(500).send({ error: "Failed to fetch analytics overview" });
  }
});

// GET visitor distribution by country
app.get("/analytics/visitor-distribution", async (req, res) => {
  try {
    const { timeRange = "7d" } = req.query;
    
    const now = new Date();
    let startDate;
    
    switch (timeRange) {
      case "1d":
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case "7d":
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case "30d":
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    }

    const distribution = await visitorsCollection.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: "$country",
          count: { $sum: 1 },
          countryCode: { $first: "$countryCode" }
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $limit: 10
      }
    ]).toArray();

    // Calculate total for percentages
    const total = distribution.reduce((sum, item) => sum + item.count, 0);

    // Format data with colors and percentages
    const colors = ["#3B82F6", "#10B981", "#FBBF24", "#EF4444", "#8B5CF6", "#F59E0B", "#06B6D4", "#84CC16", "#F97316", "#EC4899"];
    const countryFlags = {
      "Bangladesh": "🇧🇩",
      "United States": "🇺🇸",
      "Taiwan": "🇹🇼",
      "India": "🇮🇳",
      "United Kingdom": "🇬🇧",
      "Canada": "🇨🇦",
      "Germany": "🇩🇪",
      "France": "🇫🇷",
      "Japan": "🇯🇵",
      "Australia": "🇦🇺"
    };

    const formattedData = distribution.map((item, index) => ({
      name: item._id,
      value: item.count,
      color: colors[index % colors.length],
      flag: countryFlags[item._id] || "🌍",
      percentage: Math.round((item.count / total) * 100)
    }));

    res.send(formattedData);
  } catch (error) {
    res.status(500).send({ error: "Failed to fetch visitor distribution" });
  }
});

// GET recent visitors
app.get("/analytics/recent-visitors", async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    
    const recentVisitors = await visitorsCollection
      .find({})
      .sort({ lastActivity: -1 })
      .limit(parseInt(limit))
      .toArray();

    const formattedVisitors = recentVisitors.map(visitor => ({
      id: visitor._id,
      ip: visitor.ipAddress,
      country: visitor.country,
      city: visitor.city,
      device: visitor.device,
      browser: visitor.browser,
      pages: visitor.pageViews || 1,
      lastActivity: visitor.lastActivity,
      uniqueVisitorId: visitor.uniqueVisitorId,
      deviceId: visitor.deviceId
    }));

    res.send(formattedVisitors);
  } catch (error) {
    console.error("Recent visitors error:", error);
    res.status(500).send({ error: "Failed to fetch recent visitors" });
  }
});

// GET top performing pages
app.get("/analytics/top-pages", async (req, res) => {
  try {
    const { timeRange = "7d", limit = 10 } = req.query;
    
    const now = new Date();
    let startDate;
    
    switch (timeRange) {
      case "1d":
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case "7d":
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case "30d":
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    }

    // Get top pages with bounce rate calculation
    const topPages = await pageViewsCollection.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: "$path",
          views: { $sum: 1 },
          visitors: { $addToSet: "$visitorId" },
          totalTime: { $sum: "$timeOnPage" },
          visitorIds: { $push: "$visitorId" }
        }
      },
      {
        $lookup: {
          from: "pageViews",
          let: { 
            currentPath: "$_id",
            visitorIds: "$visitorIds"
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $in: ["$visitorId", "$$visitorIds"] },
                    { $gte: ["$createdAt", startDate] }
                  ]
                }
              }
            },
            {
              $group: {
                _id: "$visitorId",
                pageCount: { $sum: 1 },
                pages: { $addToSet: "$path" }
              }
            }
          ],
          as: "visitorPageCounts"
        }
      },
      {
        $project: {
          path: "$_id",
          views: 1,
          visitors: { $size: "$visitors" },
          avgTime: { 
            $cond: {
              if: { $gt: ["$views", 0] },
              then: { $divide: ["$totalTime", "$views"] },
              else: 0
            }
          },
          bounceRate: {
            $let: {
              vars: {
                singlePageVisitors: {
                  $size: {
                    $filter: {
                      input: "$visitorPageCounts",
                      cond: { $eq: ["$$this.pageCount", 1] }
                    }
                  }
                },
                totalVisitors: { $size: "$visitors" }
              },
              in: {
                $cond: {
                  if: { $gt: ["$$totalVisitors", 0] },
                  then: {
                    $multiply: [
                      { $divide: ["$$singlePageVisitors", "$$totalVisitors"] },
                      100
                    ]
                  },
                  else: 0
                }
              }
            }
          }
        }
      },
      {
        $sort: { views: -1 }
      },
      {
        $limit: parseInt(limit)
      }
    ]).toArray();

    // Format the data
    const colors = ["bg-yellow-400", "bg-blue-400", "bg-green-400", "bg-purple-400", "bg-red-400"];
    
    const formattedPages = topPages.map((page, index) => ({
      id: index + 1,
      url: page.path,
      path: page.path,
      views: page.views,
      visitors: page.visitors,
      avgTime: `${Math.round(page.avgTime / 60)}m ${Math.round(page.avgTime % 60)}s`,
      bounceRate: `${Math.round(page.bounceRate)}%`,
      color: colors[index % colors.length]
    }));

    console.log(`📊 Top pages calculated with bounce rates:`, formattedPages.map(p => ({
      path: p.path,
      views: p.views,
      visitors: p.visitors,
      bounceRate: p.bounceRate
    })));

    res.send(formattedPages);
  } catch (error) {
    console.error("Top pages error:", error);
    res.status(500).send({ error: "Failed to fetch top pages" });
  }
});

// POST track visitor (for tracking new visitors)
app.post("/analytics/track-visitor", async (req, res) => {
  try {
    const {
      ipAddress,
      userAgent,
      country,
      city,
      countryCode,
      device,
      browser,
      deviceId,
      path,
      referrer
    } = req.body;

    // Create unique visitor identifier using IP + deviceId combination
    const uniqueVisitorId = `${ipAddress}_${deviceId}`;
    
    // Check if visitor exists using the unique identifier
    let visitor = await visitorsCollection.findOne({ 
      $or: [
        { uniqueVisitorId },
        // Fallback for old records without deviceId
        { ipAddress, deviceId: { $exists: false } }
      ]
    });
    
    if (!visitor) {
      // New visitor
      visitor = {
        uniqueVisitorId,
        ipAddress,
        deviceId,
        userAgent,
        country: country || "Unknown",
        city: city || "Unknown",
        countryCode: countryCode || "XX",
        device: device || "Desktop",
        browser: browser || "Unknown",
        isNewVisitor: true,
        pageViews: 1,
        createdAt: new Date(),
        lastActivity: new Date()
      };
      
      const result = await visitorsCollection.insertOne(visitor);
      visitor._id = result.insertedId;
      
      console.log(`📱 New visitor tracked: ${device} device with ID ${deviceId} from IP ${ipAddress}`);
    } else {
      // Existing visitor - update
      await visitorsCollection.updateOne(
        { _id: visitor._id },
        {
          $set: {
            lastActivity: new Date(),
            isNewVisitor: false,
            // Update deviceId if it was missing (for old records)
            ...(deviceId && !visitor.deviceId && { deviceId, uniqueVisitorId })
          },
          $inc: { pageViews: 1 }
        }
      );
      
      console.log(`🔄 Existing visitor updated: ${device} device with ID ${deviceId} from IP ${ipAddress}`);
    }

    // Track page view
    await pageViewsCollection.insertOne({
      visitorId: visitor._id,
      uniqueVisitorId,
      path: path || "/",
      referrer: referrer || "",
      createdAt: new Date(),
      timeOnPage: 0 // Will be updated when user leaves
    });

    res.send({ 
      success: true, 
      visitorId: visitor._id,
      uniqueVisitorId,
      isNewDevice: !visitor || visitor.isNewVisitor
    });
  } catch (error) {
    console.error('❌ Error tracking visitor:', error);
    res.status(500).send({ error: "Failed to track visitor" });
  }
});

// PUT update page time (when user leaves page)
app.put("/analytics/update-page-time", async (req, res) => {
  try {
    const { visitorId, path, timeOnPage } = req.body;
    
    await pageViewsCollection.updateOne(
      { 
        visitorId: visitorId,
        path: path,
        timeOnPage: 0
      },
      {
        $set: { timeOnPage: timeOnPage }
      }
    );

    res.send({ success: true });
  } catch (error) {
    res.status(500).send({ error: "Failed to update page time" });
  }
});