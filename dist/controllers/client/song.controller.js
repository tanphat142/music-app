"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listenPatch = exports.search = exports.favorite = exports.favoritePatch = exports.likePatch = exports.detail = exports.index = void 0;
const topic_model_1 = require("../../models/topic.model");
const song_model_1 = require("../../models/song.model");
const singer_model_1 = require("../../models/singer.model");
const favorite_song_model_1 = require("../../models/favorite-song.model");
const unidecode_1 = __importDefault(require("unidecode"));
const index = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const slugTopic = req.params.slugTopic;
    const topic = yield topic_model_1.Topic.findOne({
        slug: slugTopic,
        deleted: false,
        status: "active",
    });
    const songs = yield song_model_1.Song.find({
        topicId: topic.id,
        deleted: false,
        status: "active",
    }).select("id title avatar singerId like slug");
    for (const song of songs) {
        const infoSinger = yield singer_model_1.Singer.findOne({
            _id: song.singerId,
            deleted: false,
        });
        song["singerFullName"] = infoSinger ? infoSinger.fullName : "";
    }
    res.render("client/pages/songs/index", {
        pageTitle: topic.title,
        songs: songs,
    });
});
exports.index = index;
const detail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const slugSong = req.params.slugSong;
    const song = yield song_model_1.Song.findOne({
        slug: slugSong,
        deleted: false,
        status: "active",
    });
    const singer = yield singer_model_1.Singer.findOne({
        _id: song.singerId,
    }).select("fullName");
    const topic = yield topic_model_1.Topic.findOne({
        _id: song.topicId,
    }).select("title");
    const existSongInFavorite = yield favorite_song_model_1.FavoriteSong.findOne({
        songId: song.id,
    });
    if (existSongInFavorite) {
        song["favorite"] = true;
    }
    else {
        song["favorite"] = false;
    }
    res.render("client/pages/songs/detail", {
        pageTitle: "Chi tiết bài hát",
        song: song,
        singer: singer,
        topic: topic,
    });
});
exports.detail = detail;
const likePatch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, status } = req.body;
    const song = yield song_model_1.Song.findOne({
        _id: id,
        deleted: false,
        status: "active",
    });
    if (song) {
        let updateLike = song.like;
        switch (status) {
            case "like":
                updateLike++;
                break;
            case "dislike":
                updateLike--;
                break;
            default:
                break;
        }
        yield song_model_1.Song.updateOne({
            _id: id,
            deleted: false,
            status: "active",
        }, {
            like: updateLike,
        });
        res.json({
            code: "success",
            like: updateLike,
        });
    }
    else {
        res.json({
            code: "error",
        });
    }
});
exports.likePatch = likePatch;
const favoritePatch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.body;
    const song = yield song_model_1.Song.findOne({
        _id: id,
        deleted: false,
        status: "active",
    });
    if (song) {
        const existSong = yield favorite_song_model_1.FavoriteSong.findOne({
            songId: id,
        });
        if (existSong) {
            yield favorite_song_model_1.FavoriteSong.deleteOne({
                songId: id,
            });
        }
        else {
            const record = new favorite_song_model_1.FavoriteSong({
                songId: id,
            });
            yield record.save();
        }
        res.json({
            code: "success",
        });
    }
    else {
        res.json({
            code: "error",
        });
    }
});
exports.favoritePatch = favoritePatch;
const favorite = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const songs = yield favorite_song_model_1.FavoriteSong.find({});
    for (const song of songs) {
        const infoSong = yield song_model_1.Song.findOne({
            _id: song.songId,
        });
        const infoSinger = yield singer_model_1.Singer.findOne({
            _id: infoSong.singerId,
        });
        song["title"] = infoSong.title;
        song["avatar"] = infoSong.avatar;
        song["singerFullName"] = infoSinger.fullName;
        song["slug"] = infoSong.slug;
    }
    res.render("client/pages/songs/favorite", {
        pageTitle: "Bài hát yêu thích",
        songs: songs,
    });
});
exports.favorite = favorite;
const search = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const type = req.params.type;
    const keyword = `${req.query.keyword}`;
    let keywordRegex = keyword.trim();
    keywordRegex = keywordRegex.replace(/\s+/g, "-");
    keywordRegex = (0, unidecode_1.default)(keywordRegex);
    const slugRegex = new RegExp(keywordRegex, "i");
    const songsFinal = [];
    const songs = yield song_model_1.Song.find({
        slug: slugRegex,
    }).select("slug avatar title like singerId");
    for (const song of songs) {
        const infoSinger = yield singer_model_1.Singer.findOne({
            _id: song.singerId,
            deleted: false,
        });
        song["singerFullName"] = infoSinger ? infoSinger.fullName : "";
        songsFinal.push({
            id: song.id,
            slug: song.slug,
            avatar: song.avatar,
            title: song.title,
            like: song.like,
            singerId: song.singerId,
            singerFullName: song["singerFullName"],
        });
    }
    if (type == "result") {
        res.render("client/pages/songs/search", {
            pageTitle: `Kết quả tìm kiếm: ${keyword}`,
            keyword: keyword,
            songs: songsFinal,
        });
    }
    else if (type == "suggest") {
        res.json({
            songs: songsFinal,
        });
    }
});
exports.search = search;
const listenPatch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const song = yield song_model_1.Song.findOne({
        _id: id,
        deleted: false,
        status: "active",
    });
    yield song_model_1.Song.updateOne({
        _id: id,
        deleted: false,
        status: "active",
    }, {
        listen: song.listen + 1,
    });
    const songNew = yield song_model_1.Song.findOne({
        _id: id,
    });
    res.json({
        code: "success",
        listen: songNew.listen,
    });
});
exports.listenPatch = listenPatch;
