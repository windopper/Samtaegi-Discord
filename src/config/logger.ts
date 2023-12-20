import winston from "winston";
import winstonDaily from "winston-daily-rotate-file";
import process from "process";

const { combine, timestamp, label, printf } = winston.format;

const logDir = `${process.cwd()}/logs`;

const logFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});

/*
 * Log Level
 * error: 0, warn: 1, info: 2, http: 3, verbose: 4, debug: 5, silly: 6
 */
const logger = winston.createLogger({
  format: combine(
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    label({ label: "samtaegiServer" }),
    logFormat
  ),

  //* 실제 로그를 어떻게 기록을 한 것인가 정의
  transports: [
    //* info 레벨 로그를 저장할 파일 설정 (info: 2 보다 높은 error: 0 와 warn: 1 로그들도 자동 포함해서 저장)
    new winstonDaily({
      level: "info", // info 레벨에선
      datePattern: "YYYY-MM-DD", // 파일 날짜 형식
      dirname: logDir, // 파일 경로
      filename: `%DATE%.log`, // 파일 이름
      maxFiles: 30, // 최근 30일치 로그 파일을 남김
      zippedArchive: true, // 아카이브된 로그 파일을 gzip으로 압축할지 여부
    }),
    //* error 레벨 로그를 저장할 파일 설정 (info에 자동 포함되지만 일부러 따로 빼서 설정)
    new winstonDaily({
      level: "error", // error 레벨에선
      datePattern: "YYYY-MM-DD",
      dirname: logDir + "/error", // /logs/error 하위에 저장
      filename: `%DATE%.error.log`, // 에러 로그는 2020-05-28.error.log 형식으로 저장
      maxFiles: 30,
      zippedArchive: true,
    }),
  ],

  exceptionHandlers: [
    new winstonDaily({
        level: 'error',
        datePattern: 'YYYY-MM-DD',
        dirname: logDir,
        filename: `%DATE%.exception.log`,
        maxFiles: 30,
        zippedArchive: true
    })
  ]
});

if (process.env.NODE_ENV !== 'production') {
    logger.add(
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple(),
            )
        })
    )
}


export default logger;