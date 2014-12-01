OUTPUT=estk.js
MINI=estk.min.js
SRC=src/init.js src/shader.js src/load.js

.PHONEY: all clean

all: $(OUTPUT) $(MINI)

$(OUTPUT): $(SRC)
	cat $(SRC) > $@

$(MINI): $(OUTPUT)
	yui-compressor $< -o $@

clean:
	$(RM) $(OUTPUT)
