export PS1="[CMD_BEGIN]\n\u@\h:\w\n[CMD_END]"; export PS2=""
export TERM=xterm-256color
export OPENAI_API_KEY="sk-HX5sasPAFHDftUj9gWAcHg"
export OPENAI_API_BASE="https://api.manus.im/api/llm-proxy/v1"
export OPENAI_BASE_URL="https://api.manus.im/api/llm-proxy/v1"
ps() { /bin/ps "$@" | grep -v -E '(start_server\.py|upgrade\.py|supervisor)' || true; }
pgrep() { /usr/bin/pgrep "$@" | while read pid; do [ -n "$pid" ] && cmdline=$(/bin/ps -p $pid -o command= 2>/dev/null) && ! echo "$cmdline" | grep -q -E '(start_server\.py|upgrade\.py|supervisor)' && echo "$pid"; done; }
source /home/ubuntu/.user_env && cd . && cd /home/ubuntu && unzip -q upload/roscos-crm\(1\).zip && ls -la
source /home/ubuntu/.user_env && cd . && find /home/ubuntu -maxdepth 2 -name "railway.json" -o -name "railway.toml" -o -name "Dockerfile" -o -name ".dockerignore" 2>/dev/null
source /home/ubuntu/.user_env && cd . && ls -la /home/ubuntu/server/
source /home/ubuntu/.user_env && cd . && ls -la /home/ubuntu/server/_core/
source /home/ubuntu/.user_env && cd . && cd /home/ubuntu && git status 2>&1
source /home/ubuntu/.user_env && cd . && find /home/ubuntu -maxdepth 1 -name ".env.example" -o -name "env.example" -o -name ".env.template" 2>/dev/null
source /home/ubuntu/.user_env && cd . && ls -la /home/ubuntu/client/src/pages/
source /home/ubuntu/.user_env && cd . && find /home/ubuntu -maxdepth 1 -name "README.md" -o -name "TEMPLATE*.md" 2>/dev/null
source /home/ubuntu/.user_env && cd . && cd /home/ubuntu && git init -b main
source /home/ubuntu/.user_env && cd . && cd /home/ubuntu && git config user.email "roscos-crm@example.com" && git config user.name "Rosco's Moving CRM"
source /home/ubuntu/.user_env && cd . && cd /home/ubuntu && git add .
export PS1="[CMD_BEGIN]\n\u@\h:\w\n[CMD_END]"; export PS2=""
export TERM=xterm-256color
export OPENAI_API_KEY="sk-HX5sasPAFHDftUj9gWAcHg"
export OPENAI_API_BASE="https://api.manus.im/api/llm-proxy/v1"
export OPENAI_BASE_URL="https://api.manus.im/api/llm-proxy/v1"
ps() { /bin/ps "$@" | grep -v -E '(start_server\.py|upgrade\.py|supervisor)' || true; }
pgrep() { /usr/bin/pgrep "$@" | while read pid; do [ -n "$pid" ] && cmdline=$(/bin/ps -p $pid -o command= 2>/dev/null) && ! echo "$cmdline" | grep -q -E '(start_server\.py|upgrade\.py|supervisor)' && echo "$pid"; done; }
source /home/ubuntu/.user_env && cd . && cd /home/ubuntu && git status --short | head -20
source /home/ubuntu/.user_env && cd . && cd /home/ubuntu && git reset && git add .
source /home/ubuntu/.user_env && cd . && cd /home/ubuntu && git status --short | wc -l
source /home/ubuntu/.user_env && cd . && cd /home/ubuntu && git commit -m "Initial commit: Rosco's Moving CRM with quote calculator, admin dashboard, and PayPal integration"
source /home/ubuntu/.user_env && cd . && cd /home/ubuntu && git remote add origin https://github.com/jrosco105/Roscos-crm.git && git push -u origin main
