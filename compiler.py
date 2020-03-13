#!/bin/python

import sys
import os

lines = []

def main():
    filepath = sys.argv[1]
    if not os.path.isfile(filepath):
        print("File path {} does not exist. Exiting...".format(filepath))
        sys.exit()

    with open(filepath) as fp:
        for line in fp:
            if (line.strip() != ""):
                lines.append(line)

    final = "game.dataJSON = {\n"
    # print("game.dataJSON = {")
    counter = 0
    while counter < lines.__len__():
        line = lines[counter]
        indentLevel = getIndentLevel(line)

        if indentLevel == 0:
            toPrint = indent(4)
            a = [x.strip() for x in escaped_split(line)]
            toPrint += "\"" + a[0] + "\":" + " {\n"
            if not a[1]:
                toPrint += indent(8) + "heading: undefined,"
            else:
                toPrint += indent(8) + "heading: " + "\"" + a[1] + "\"" + ","
            final += toPrint + "\n"

        if indentLevel == 4:
            toPrint = indent(8) + "text: "
            toPrint += "\"" + line.strip() + "\"" + ","
            final += toPrint + "\n"

        if indentLevel == 8:
            toPrint = indent(8) + "choices: [\n"
            num = getSubsequentIndents(8, lines.index(line) + 1)

            for i in range(num):
                toPrint += indent(12) + "new Choice(" + \
                    lines[counter + i].strip()
                if (i != num - 1):
                    toPrint += "),\n"
                elif (i == num - 1):
                    toPrint += ")\n"
                counter += i
            toPrint += indent(8) + "]\n" + indent(4)

            if (counter != lines.__len__() - 1):
                toPrint += "},\n"
            else:
                toPrint += "}"

            final += toPrint
        counter += 1
    final += "\n}"
    
    print(final)

    exit()


def indent(n):
    toRet = ""
    for i in range(n):
        toRet += " "
    return toRet


def getIndentLevel(str):
    i = 0
    a = str[i]
    while str[i] == " ":
        i += 1
    return i


def getSubsequentIndents(len, index):
    toRet = 0
    i = index - 1
    while getIndentLevel(lines[i]) == len:
        if (i + 1 < lines.__len__()):
            toRet += 1
            i += 1
        else:
            return toRet + 1
    return toRet


def escaped_split(a, escape='\\', separator=':'):
    result = []
    token = ''
    state = 0
    for c in a:
            if state == 0:
                if c == escape:
                    state = 1
                elif c == separator:
                    result.append(token)
                    token = ''
                else:
                    token += c
            elif state == 1:
                token += c
                state = 0
    result.append(token)
    return result


main()