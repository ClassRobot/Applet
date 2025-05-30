! function(e, n) {
	"function" == typeof define && (define.amd || define.cmd) ? define(function() {
		return n(e)
	}) : n(e, !0)
}(window, function(o, e) {

	if (!o.jWeixin) {
		var n, c = {
				config: "preVerifyJSAPI",
				onMenuShareTimeline: "menu:share:timeline",
				onMenuShareAppMessage: "menu:share:appmessage",
				onMenuShareQQ: "menu:share:qq",
				onMenuShareWeibo: "menu:share:weiboApp",
				onMenuShareQZone: "menu:share:QZone",
				previewImage: "imagePreview",
				getLocation: "geoLocation",
				openProductSpecificView: "openProductViewWithPid",
				addCard: "batchAddCard",
				openCard: "batchViewCard",
				chooseWXPay: "getBrandWCPayRequest",
				openEnterpriseRedPacket: "getRecevieBizHongBaoRequest",
				startSearchBeacons: "startMonitoringBeacons",
				stopSearchBeacons: "stopMonitoringBeacons",
				onSearchBeacons: "onBeaconsInRange",
				consumeAndShareCard: "consumedShareCard",
				openAddress: "editAddress"
			},
			a = function() {
				var e = {};
				for (var n in c) e[c[n]] = n;
				return e
			}(),
			i = o.document,
			t = i.title,
			r = navigator.userAgent.toLowerCase(),
			s = navigator.platform.toLowerCase(),
			d = !(!s.match("mac") && !s.match("win")),
			u = -1 != r.indexOf("wxdebugger"),
			l = -1 != r.indexOf("micromessenger"),
			p = -1 != r.indexOf("android"),
			f = -1 != r.indexOf("iphone") || -1 != r.indexOf("ipad"),
			m = (n = r.match(/micromessenger\/(\d+\.\d+\.\d+)/) || r.match(/micromessenger\/(\d+\.\d+)/)) ? n[1] :
			"",
			g = {
				initStartTime: L(),
				initEndTime: 0,
				preVerifyStartTime: 0,
				preVerifyEndTime: 0
			},
			h = {
				version: 1,
				appId: "",
				initTime: 0,
				preVerifyTime: 0,
				networkType: "",
				isPreVerifyOk: 1,
				systemType: f ? 1 : p ? 2 : -1,
				clientVersion: m,
				url: encodeURIComponent(location.href)
			},
			v = {},
			S = {
				_completes: []
			},
			y = {
				state: 0,
				data: {}
			};
		O(function() {
			g.initEndTime = L()
		});
		var I = !1,
			_ = [],
			w = {
				config: function(e) {
					B("config", v = e);
					var t = !1 !== v.check;
					O(function() {
						if (t) M(c.config, {
							verifyJsApiList: C(v.jsApiList),
							verifyOpenTagList: C(v.openTagList)
						}, function() {
							S._complete = function(e) {
								g.preVerifyEndTime = L(), y.state = 1, y.data = e
							}, S.success = function(e) {
								h.isPreVerifyOk = 0
							}, S.fail = function(e) {
								S._fail ? S._fail(e) : y.state = -1
							};
							var t = S._completes;
							return t.push(function() {
								! function() {
									if (!(d || u || v.debug || m < "6.0.2" || h
											.systemType < 0)) {
										var i = new Image;
										h.appId = v.appId, h.initTime = g.initEndTime -
											g.initStartTime, h.preVerifyTime = g
											.preVerifyEndTime - g.preVerifyStartTime, w
											.getNetworkType({
												isInnerInvoke: !0,
												success: function(e) {
													h.networkType = e
														.networkType;
													var n =
														"https://open.weixin.qq.com/sdk/report?v=" +
														h.version + "&o=" + h
														.isPreVerifyOk + "&s=" +
														h.systemType + "&c=" + h
														.clientVersion + "&a=" +
														h.appId + "&n=" + h
														.networkType + "&i=" + h
														.initTime + "&p=" + h
														.preVerifyTime + "&u=" +
														h.url;
													i.src = n
												}
											})
									}
								}()
							}), S.complete = function(e) {
								for (var n = 0, i = t.length; n < i; ++n) t[n]();
								S._completes = []
							}, S
						}()), g.preVerifyStartTime = L();
						else {
							y.state = 1;
							for (var e = S._completes, n = 0, i = e.length; n < i; ++n) e[n]();
							S._completes = []
						}
					}), w.invoke || (w.invoke = function(e, n, i) {
						o.WeixinJSBridge && WeixinJSBridge.invoke(e, x(n), i)
					}, w.on = function(e, n) {
						o.WeixinJSBridge && WeixinJSBridge.on(e, n)
					})
				},
				ready: function(e) {
					0 != y.state ? e() : (S._completes.push(e), !l && v.debug && e())
				},
				error: function(e) {
					m < "6.0.2" || (-1 == y.state ? e(y.data) : S._fail = e)
				},
				checkJsApi: function(e) {
					M("checkJsApi", {
						jsApiList: C(e.jsApiList)
					}, (e._complete = function(e) {
						if (p) {
							var n = e.checkResult;
							n && (e.checkResult = JSON.parse(n))
						}
						e = function(e) {
							var n = e.checkResult;
							for (var i in n) {
								var t = a[i];
								t && (n[t] = n[i], delete n[i])
							}
							return e
						}(e)
					}, e))
				},
				onMenuShareTimeline: function(e) {
					P(c.onMenuShareTimeline, {
						complete: function() {
							M("shareTimeline", {
								title: e.title || t,
								desc: e.title || t,
								img_url: e.imgUrl || "",
								link: e.link || location.href,
								type: e.type || "link",
								data_url: e.dataUrl || ""
							}, e)
						}
					}, e)
				},
				onMenuShareAppMessage: function(n) {
					P(c.onMenuShareAppMessage, {
						complete: function(e) {
							"favorite" === e.scene ? M("sendAppMessage", {
								title: n.title || t,
								desc: n.desc || "",
								link: n.link || location.href,
								img_url: n.imgUrl || "",
								type: n.type || "link",
								data_url: n.dataUrl || ""
							}) : M("sendAppMessage", {
								title: n.title || t,
								desc: n.desc || "",
								link: n.link || location.href,
								img_url: n.imgUrl || "",
								type: n.type || "link",
								data_url: n.dataUrl || ""
							}, n)
						}
					}, n)
				},
				onMenuShareQQ: function(e) {
					P(c.onMenuShareQQ, {
						complete: function() {
							M("shareQQ", {
								title: e.title || t,
								desc: e.desc || "",
								img_url: e.imgUrl || "",
								link: e.link || location.href
							}, e)
						}
					}, e)
				},
				onMenuShareWeibo: function(e) {
					P(c.onMenuShareWeibo, {
						complete: function() {
							M("shareWeiboApp", {
								title: e.title || t,
								desc: e.desc || "",
								img_url: e.imgUrl || "",
								link: e.link || location.href
							}, e)
						}
					}, e)
				},
				onMenuShareQZone: function(e) {
					P(c.onMenuShareQZone, {
						complete: function() {
							M("shareQZone", {
								title: e.title || t,
								desc: e.desc || "",
								img_url: e.imgUrl || "",
								link: e.link || location.href
							}, e)
						}
					}, e)
				},
				updateTimelineShareData: function(e) {
					M("updateTimelineShareData", {
						title: e.title,
						link: e.link,
						imgUrl: e.imgUrl
					}, e)
				},
				updateAppMessageShareData: function(e) {
					M("updateAppMessageShareData", {
						title: e.title,
						desc: e.desc,
						link: e.link,
						imgUrl: e.imgUrl
					}, e)
				},
				startRecord: function(e) {
					M("startRecord", {}, e)
				},
				stopRecord: function(e) {
					M("stopRecord", {}, e)
				},
				onVoiceRecordEnd: function(e) {
					P("onVoiceRecordEnd", e)
				},
				playVoice: function(e) {
					M("playVoice", {
						localId: e.localId
					}, e)
				},
				pauseVoice: function(e) {
					M("pauseVoice", {
						localId: e.localId
					}, e)
				},
				stopVoice: function(e) {
					M("stopVoice", {
						localId: e.localId
					}, e)
				},
				onVoicePlayEnd: function(e) {
					P("onVoicePlayEnd", e)
				},
				uploadVoice: function(e) {
					M("uploadVoice", {
						localId: e.localId,
						isShowProgressTips: 0 == e.isShowProgressTips ? 0 : 1
					}, e)
				},
				downloadVoice: function(e) {
					M("downloadVoice", {
						serverId: e.serverId,
						isShowProgressTips: 0 == e.isShowProgressTips ? 0 : 1
					}, e)
				},
				translateVoice: function(e) {
					M("translateVoice", {
						localId: e.localId,
						isShowProgressTips: 0 == e.isShowProgressTips ? 0 : 1
					}, e)
				},
				chooseImage: function(e) {
					M("chooseImage", {
						scene: "1|2",
						count: e.count || 9,
						sizeType: e.sizeType || ["original", "compressed"],
						sourceType: e.sourceType || ["album", "camera"]
					}, (e._complete = function(e) {
						if (p) {
							var n = e.localIds;
							try {
								n && (e.localIds = JSON.parse(n))
							} catch (e) {}
						}
					}, e))
				},
				getLocation: function(e) {},
				previewImage: function(e) {
					M(c.previewImage, {
						current: e.current,
						urls: e.urls
					}, e)
				},
				uploadImage: function(e) {
					M("uploadImage", {
						localId: e.localId,
						isShowProgressTips: 0 == e.isShowProgressTips ? 0 : 1
					}, e)
				},
				downloadImage: function(e) {
					M("downloadImage", {
						serverId: e.serverId,
						isShowProgressTips: 0 == e.isShowProgressTips ? 0 : 1
					}, e)
				},
				getLocalImgData: function(e) {
					!1 === I ? (I = !0, M("getLocalImgData", {
						localId: e.localId
					}, (e._complete = function(e) {
						if (I = !1, 0 < _.length) {
							var n = _.shift();
							wx.getLocalImgData(n)
						}
					}, e))) : _.push(e)
				},
				getNetworkType: function(e) {
					M("getNetworkType", {}, (e._complete = function(e) {
						e = function(e) {
							var n = e.errMsg;
							e.errMsg = "getNetworkType:ok";
							var i = e.subtype;
							if (delete e.subtype, i) e.networkType = i;
							else {
								var t = n.indexOf(":"),
									o = n.substring(t + 1);
								switch (o) {
									case "wifi":
									case "edge":
									case "wwan":
										e.networkType = o;
										break;
									default:
										e.errMsg = "getNetworkType:fail"
								}
							}
							return e
						}(e)
					}, e))
				},
				openLocation: function(e) {
					M("openLocation", {
						latitude: e.latitude,
						longitude: e.longitude,
						name: e.name || "",
						address: e.address || "",
						scale: e.scale || 28,
						infoUrl: e.infoUrl || ""
					}, e)
				},
				getLocation: function(e) {
					M(c.getLocation, {
						type: (e = e || {}).type || "wgs84"
					}, (e._complete = function(e) {
						delete e.type
					}, e))
				},
				hideOptionMenu: function(e) {
					M("hideOptionMenu", {}, e)
				},
				showOptionMenu: function(e) {
					M("showOptionMenu", {}, e)
				},
				closeWindow: function(e) {
					M("closeWindow", {}, e = e || {})
				},
				hideMenuItems: function(e) {
					M("hideMenuItems", {
						menuList: e.menuList
					}, e)
				},
				showMenuItems: function(e) {
					M("showMenuItems", {
						menuList: e.menuList
					}, e)
				},
				hideAllNonBaseMenuItem: function(e) {
					M("hideAllNonBaseMenuItem", {}, e)
				},
				showAllNonBaseMenuItem: function(e) {
					M("showAllNonBaseMenuItem", {}, e)
				},
				scanQRCode: function(e) {
					M("scanQRCode", {
						needResult: (e = e || {}).needResult || 0,
						scanType: e.scanType || ["qrCode", "barCode"]
					}, (e._complete = function(e) {
						if (f) {
							var n = e.resultStr;
							if (n) {
								var i = JSON.parse(n);
								e.resultStr = i && i.scan_code && i.scan_code.scan_result
							}
						}
					}, e))
				},
				openAddress: function(e) {
					M(c.openAddress, {}, (e._complete = function(e) {
						e = function(e) {
							return e.postalCode = e.addressPostalCode, delete e
								.addressPostalCode, e.provinceName = e.proviceFirstStageName,
								delete e.proviceFirstStageName, e.cityName = e
								.addressCitySecondStageName, delete e
								.addressCitySecondStageName, e.countryName = e
								.addressCountiesThirdStageName, delete e
								.addressCountiesThirdStageName, e.detailInfo = e
								.addressDetailInfo, delete e.addressDetailInfo, e
						}(e)
					}, e))
				},
				openProductSpecificView: function(e) {
					M(c.openProductSpecificView, {
						pid: e.productId,
						view_type: e.viewType || 0,
						ext_info: e.extInfo
					}, e)
				},
				addCard: function(e) {
					for (var n = e.cardList, i = [], t = 0, o = n.length; t < o; ++t) {
						var r = n[t],
							a = {
								card_id: r.cardId,
								card_ext: r.cardExt
							};
						i.push(a)
					}
					M(c.addCard, {
						card_list: i
					}, (e._complete = function(e) {
						var n = e.card_list;
						if (n) {
							for (var i = 0, t = (n = JSON.parse(n)).length; i < t; ++i) {
								var o = n[i];
								o.cardId = o.card_id, o.cardExt = o.card_ext, o.isSuccess = !!o
									.is_succ, delete o.card_id, delete o.card_ext, delete o.is_succ
							}
							e.cardList = n, delete e.card_list
						}
					}, e))
				},
				chooseCard: function(e) {
					M("chooseCard", {
						app_id: v.appId,
						location_id: e.shopId || "",
						sign_type: e.signType || "SHA1",
						card_id: e.cardId || "",
						card_type: e.cardType || "",
						card_sign: e.cardSign,
						time_stamp: e.timestamp + "",
						nonce_str: e.nonceStr
					}, (e._complete = function(e) {
						e.cardList = e.choose_card_info, delete e.choose_card_info
					}, e))
				},
				openCard: function(e) {
					for (var n = e.cardList, i = [], t = 0, o = n.length; t < o; ++t) {
						var r = n[t],
							a = {
								card_id: r.cardId,
								code: r.code
							};
						i.push(a)
					}
					M(c.openCard, {
						card_list: i
					}, e)
				},
				consumeAndShareCard: function(e) {
					M(c.consumeAndShareCard, {
						consumedCardId: e.cardId,
						consumedCode: e.code
					}, e)
				},
				chooseWXPay: function(e) {
					M(c.chooseWXPay, V(e), e)
				},
				openEnterpriseRedPacket: function(e) {
					M(c.openEnterpriseRedPacket, V(e), e)
				},
				startSearchBeacons: function(e) {
					M(c.startSearchBeacons, {
						ticket: e.ticket
					}, e)
				},
				stopSearchBeacons: function(e) {
					M(c.stopSearchBeacons, {}, e)
				},
				onSearchBeacons: function(e) {
					P(c.onSearchBeacons, e)
				},
				openEnterpriseChat: function(e) {
					M("openEnterpriseChat", {
						useridlist: e.userIds,
						chatname: e.groupName
					}, e)
				},
				launchMiniProgram: function(e) {
					M("launchMiniProgram", {
						targetAppId: e.targetAppId,
						path: function(e) {
							if ("string" == typeof e && 0 < e.length) {
								var n = e.split("?")[0],
									i = e.split("?")[1];
								return n += ".html", void 0 !== i ? n + "?" + i : n
							}
						}(e.path),
						envVersion: e.envVersion
					}, e)
				},
				openBusinessView: function(e) {
					M("openBusinessView", {
						businessType: e.businessType,
						queryString: e.queryString || "",
						envVersion: e.envVersion
					}, (e._complete = function(n) {
						if (p) {
							var e = n.extraData;
							if (e) try {
								n.extraData = JSON.parse(e)
							} catch (e) {
								n.extraData = {}
							}
						}
					}, e))
				},
				miniProgram: {
					navigateBack: function(e) {
						e = e || {}, O(function() {
							M("invokeMiniProgramAPI", {
								name: "navigateBack",
								arg: {
									delta: e.delta || 1
								}
							}, e)
						})
					},
					navigateTo: function(e) {
						O(function() {
							M("invokeMiniProgramAPI", {
								name: "navigateTo",
								arg: {
									url: e.url
								}
							}, e)
						})
					},
					redirectTo: function(e) {
						O(function() {
							M("invokeMiniProgramAPI", {
								name: "redirectTo",
								arg: {
									url: e.url
								}
							}, e)
						})
					},
					switchTab: function(e) {
						O(function() {
							M("invokeMiniProgramAPI", {
								name: "switchTab",
								arg: {
									url: e.url
								}
							}, e)
						})
					},
					reLaunch: function(e) {
						O(function() {
							M("invokeMiniProgramAPI", {
								name: "reLaunch",
								arg: {
									url: e.url
								}
							}, e)
						})
					},
					postMessage: function(e) {
						O(function() {
							M("invokeMiniProgramAPI", {
								name: "postMessage",
								arg: e.data || {}
							}, e)
						})
					},
					getEnv: function(e) {
						O(function() {
							e({
								miniprogram: "miniprogram" === o.__wxjs_environment
							})
						})
					}
				}
			},
			T = 1,
			k = {};
		return i.addEventListener("error", function(e) {
			if (!p) {
				var n = e.target,
					i = n.tagName,
					t = n.src;
				if ("IMG" == i || "VIDEO" == i || "AUDIO" == i || "SOURCE" == i)
					if (-1 != t.indexOf("wxlocalresource://")) {
						e.preventDefault(), e.stopPropagation();
						var o = n["wx-id"];
						if (o || (o = T++, n["wx-id"] = o), k[o]) return;
						k[o] = !0, wx.ready(function() {
							wx.getLocalImgData({
								localId: t,
								success: function(e) {
									n.src = e.localData
								}
							})
						})
					}
			}
		}, !0), i.addEventListener("load", function(e) {
			if (!p) {
				var n = e.target,
					i = n.tagName;
				n.src;
				if ("IMG" == i || "VIDEO" == i || "AUDIO" == i || "SOURCE" == i) {
					var t = n["wx-id"];
					t && (k[t] = !1)
				}
			}
		}, !0), e && (o.wx = o.jWeixin = w), w
	}

	function M(n, e, i) {
		o.WeixinJSBridge ? WeixinJSBridge.invoke(n, x(e), function(e) {
			A(n, e, i)
		}) : B(n, i)
	}

	function P(n, i, t) {
		o.WeixinJSBridge ? WeixinJSBridge.on(n, function(e) {
			t && t.trigger && t.trigger(e), A(n, e, i)
		}) : B(n, t || i)
	}

	function x(e) {
		return (e = e || {}).appId = v.appId, e.verifyAppId = v.appId, e.verifySignType = "sha1", e
			.verifyTimestamp = v.timestamp + "", e.verifyNonceStr = v.nonceStr, e.verifySignature = v.signature, e
	}

	function V(e) {
		return {
			timeStamp: e.timestamp + "",
			nonceStr: e.nonceStr,
			package: e.package,
			paySign: e.paySign,
			signType: e.signType || "SHA1"
		}
	}

	function A(e, n, i) {
		"openEnterpriseChat" != e && "openBusinessView" !== e || (n.errCode = n.err_code), delete n.err_code,
			delete n.err_desc, delete n.err_detail;
		var t = n.errMsg;
		t || (t = n.err_msg, delete n.err_msg, t = function(e, n) {
				var i = e,
					t = a[i];
				t && (i = t);
				var o = "ok";
				if (n) {
					var r = n.indexOf(":");
					"confirm" == (o = n.substring(r + 1)) && (o = "ok"), "failed" == o && (o = "fail"), -1 != o
						.indexOf("failed_") && (o = o.substring(7)), -1 != o.indexOf("fail_") && (o = o
							.substring(5)), "access denied" != (o = (o = o.replace(/_/g, " ")).toLowerCase()) &&
						"no permission to execute" != o || (o = "permission denied"), "config" == i &&
						"function not exist" == o && (o = "ok"), "" == o && (o = "fail")
				}
				return n = i + ":" + o
			}(e, t), n.errMsg = t), (i = i || {})._complete && (i._complete(n), delete i._complete), t = n.errMsg ||
			"", v.debug && !i.isInnerInvoke && alert(JSON.stringify(n));
		var o = t.indexOf(":");
		switch (t.substring(o + 1)) {
			case "ok":
				i.success && i.success(n);
				break;
			case "cancel":
				i.cancel && i.cancel(n);
				break;
			default:
				i.fail && i.fail(n)
		}
		i.complete && i.complete(n)
	}

	function C(e) {
		if (e) {
			for (var n = 0, i = e.length; n < i; ++n) {
				var t = e[n],
					o = c[t];
				o && (e[n] = o)
			}
			return e
		}
	}

	function B(e, n) {
		if (!(!v.debug || n && n.isInnerInvoke)) {
			var i = a[e];
			i && (e = i), n && n._complete && delete n._complete, console.log('"' + e + '",', n || "")
		}
	}

	function L() {
		return (new Date).getTime()
	}

	function O(e) {
		l && (o.WeixinJSBridge ? e() : i.addEventListener && i.addEventListener("WeixinJSBridgeReady", e, !1))
	}
});
