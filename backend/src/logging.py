import logging

logging.basicConfig(filename="std.log", format="%(asctime)s %(message)s", filemode="w")

logger = logging.getLogger()

logger.setLevel(logging.DEBUG)
