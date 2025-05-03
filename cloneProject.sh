#!/bin/bash

#Initializing
DmW_Function_Title="Git Clone MacrosDmW"
DmW_Project_Folder="MacrosDmW"
DmW_Project_Git="https://github.com/DeadManWalkingTO/MacrosDmW.git"
DmW_Project_Git_Branch="master"

#Start
clear
echo "##################################################"
echo "Start"
echo "##################################################"
echo #
sleep 1

#Change Directory to Home
echo "=================================================="
echo "Change Directory to Home"
echo "--------------------------------------------------"
cd ~
if [ $? -eq 0 ]; then : ; else echo "Fail"; exit; fi
echo $PWD
if [ $? -eq 0 ]; then echo; echo "Done"; else echo "Fail"; exit; fi
echo "=================================================="
echo #
sleep 1s

#Remove old Project's Directory
echo "=================================================="
echo "Remove old Project's Directory"
echo "--------------------------------------------------"
rm -rf $DmW_Project_Folder
if [ $? -eq 0 ]; then echo; echo "Done"; else echo "Fail"; exit; fi
echo "=================================================="
echo #
sleep 1s

#Create New Project's Directory
echo "=================================================="
echo "Create New Project's Directory"
echo "--------------------------------------------------"
mkdir -p $DmW_Project_Folder
if [ $? -eq 0 ]; then echo; echo "Done"; else echo "Fail"; exit; fi
echo "=================================================="
echo #
sleep 1s

#Download Project
echo "=================================================="
echo "Download Project"
echo "--------------------------------------------------"
git clone --branch=$DmW_Project_Git_Branch $DmW_Project_Git
if [ $? -eq 0 ]; then echo; echo "Done"; else echo "Fail"; exit; fi
echo "=================================================="
echo #
sleep 1s

#Change Directory to Project's
echo "=================================================="
echo "Change Directory to Project's"
echo "--------------------------------------------------"
cd $DmW_Project_Folder
if [ $? -eq 0 ]; then : ; else echo "Fail"; exit; fi
echo $PWD
if [ $? -eq 0 ]; then echo; echo "Done"; else echo "Fail"; exit; fi
echo "=================================================="
echo #
sleep 1s

#Git Fetch
echo "=================================================="
echo "Git Fetch"
echo "--------------------------------------------------"
git fetch -q origin
if [ $? -eq 0 ]; then echo; echo "Done"; else echo "Fail"; exit; fi
echo "=================================================="
echo #
sleep 1s

#Git Checkout
echo "=================================================="
echo "Git Checkout"
echo "--------------------------------------------------"
git checkout -qf FETCH_HEAD
if [ $? -eq 0 ]; then echo; echo "Done"; else echo "Fail"; exit; fi
echo "=================================================="
echo #
sleep 1s

#Git Submodules
echo "=================================================="
echo "Git Submodules"
echo "--------------------------------------------------"
git submodule update --init --recursive
if [ $? -eq 0 ]; then echo; echo "Done"; else echo "Fail"; exit; fi
echo "=================================================="
echo #
sleep 1s

#Change Directory to Home
echo "=================================================="
echo "Change Directory to Home"
echo "--------------------------------------------------"
cd ~/
if [ $? -eq 0 ]; then : ; else echo "Fail"; exit; fi
echo $PWD
if [ $? -eq 0 ]; then echo; echo "Done"; else echo "Fail"; exit; fi
echo "=================================================="
echo #
sleep 1s

#Download was completed Successfully
echo "##################################################"
echo "Download was completed Successfully"
echo "##################################################"

#End

#EoF
