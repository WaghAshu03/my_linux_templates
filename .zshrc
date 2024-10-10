clear && python ~/Templates/neofetch_images/neofetch_image_script.py

alias restart-plasma="kquitapp5 plasmashell || killall plasmashell && kstart5 plasmashell"
alias pomodoro="python '/mnt/sda1/InstaVid/pomodoro.py'"
alias calc-lec="python '/mnt/sda1/InstaVid/calc_lec.py'"
alias update-linux="sudo python -u '/home/ashu/Templates/update_linux_script.py'"
alias neofetch-image="python ~/Templates/neofetch_images/neofetch_image_script.py"

if [[ -r "${XDG_CACHE_HOME:-$HOME/.cache}/p10k-instant-prompt-${(%):-%n}.zsh" ]]; then
  source "${XDG_CACHE_HOME:-$HOME/.cache}/p10k-instant-prompt-${(%):-%n}.zsh"
fi

export ZSH="$HOME/.oh-my-zsh"

ZSH_THEME="robbyrussell"

plugins=(
	git
#	zsh-syntax-highlighting
        zsh-autosuggestions
        fzf
)

source $ZSH/oh-my-zsh.sh

source ~/.oh-my-zsh/custom/themes/powerlevel10k/powerlevel10k.zsh-theme

[[ ! -f ~/.p10k.zsh ]] || source ~/.p10k.zsh

[ -f ~/.fzf.zsh ] && source ~/.fzf.zsh
