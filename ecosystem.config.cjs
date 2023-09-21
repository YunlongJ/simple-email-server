module.exports = {
    apps: [
        {
            name: 'temp-email',
            script: 'index.js',
            instances: 1,
            autorestart: true,
            watch: false,
            max_memory_restart: '2G',
            exec_mode   : 'fork',
            error_file      : "./logs/err.log",
            out_file        : "./logs/out.log",
            merge_logs      : true,
            log_date_format : "YYYY-MM-DD HH:mm Z",
            env: {
                NODE_ENV: 'production'
            }
        }
    ]
};
