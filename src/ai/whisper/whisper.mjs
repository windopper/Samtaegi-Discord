import whisper from 'whisper-node';

const filePath = "test.mp3"; // required

const options = {
  modelName: "base",       // default
  // modelPath: "/custom/path/to/model.bin", // use model in a custom directory (cannot use along with 'modelName')
  whisperOptions: {
    language: 'auto',         // default (use 'auto' for auto detect)
    gen_file_txt: true,      // outputs .txt file
    gen_file_subtitle: false, // outputs .srt file
    gen_file_vtt: false,      // outputs .vtt file
    word_timestamps: true     // timestamp for every word
    // timestamp_size: 0      // cannot use along with word_timestamps:true
  }
}

const transcript = await whisper(filePath, options);